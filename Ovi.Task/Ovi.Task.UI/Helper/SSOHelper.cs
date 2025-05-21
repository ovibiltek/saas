using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Web;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace Ovi.Task.UI.Helper
{
    public static class SsoHelper
    {
        /// <summary>
        /// OpenID Connect token endpoint'ine istek göndererek token bilgisini getirir.
        /// </summary>
        /// <param name="code">Authorization Code</param>
        /// <param name="tokenEndpoint">Token endpoint URL'si</param>
        /// <param name="clientId">Client ID</param>
        /// <param name="clientSecret">Client Secret</param>
        /// <param name="redirectUri">Redirect URI</param>
        /// <returns>TokenResponse nesnesi</returns>
        public static TokenResponse GetToken(string code, string tokenEndpoint, string clientId, string clientSecret, string redirectUri)
        {
            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";

                var requestBody = $"grant_type=authorization_code&code={HttpUtility.UrlEncode(code)}" +
                                  $"&client_id={HttpUtility.UrlEncode(clientId)}" +
                                  $"&client_secret={HttpUtility.UrlEncode(clientSecret)}" +
                                  $"&redirect_uri={HttpUtility.UrlEncode(redirectUri)}";

                try
                {
                    var response = client.UploadString(tokenEndpoint, requestBody);
                    return JsonConvert.DeserializeObject<TokenResponse>(response);
                }
                catch (Exception ex)
                {
                    LogHelper.LogToFile($"Error fetching token from OpenID provider: {ex.Message}");
                    return null;
                }
            }
        }

        /// <summary>
        /// Gelen ID Token'ı doğrulayarak, token içindeki claim'lerden preferred_username değerini döndürür.
        /// </summary>
        /// <param name="idToken">ID Token</param>
        /// <param name="jwksUri">JWKS URI</param>
        /// <param name="issuer">Token'ın issuer'ı</param>
        /// <param name="clientId">Token'ın audience değeri olarak beklenen clientId</param>
        /// <returns>Doğrulanan kullanıcı bilgilerini içeren UserInfo nesnesi</returns>
        public static UserInfo ValidateIdToken(string idToken, string jwksUri, string issuer, string clientId)
        {
            using (var client = new WebClient())
            {
                try
                {
                    var jwksResponse = client.DownloadString(jwksUri);
                    var jwks = JsonConvert.DeserializeObject<JsonWebKeySet>(jwksResponse);

                    var tokenHandler = new JwtSecurityTokenHandler();

                    var jwtToken = tokenHandler.ReadJwtToken(idToken);
                    LogHelper.LogToFile("Token Header: " + jwtToken.Header.SerializeToJson());

                    var validationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = issuer,
                        ValidAudience = clientId,
                        IssuerSigningKeys = jwks.Keys
                    };

                    var principal = tokenHandler.ValidateToken(idToken, validationParameters, out SecurityToken validatedToken);

                    foreach (var claim in principal.Claims)
                    {
                        LogHelper.LogToFile($"Claim Type: {claim.Type}, Value: {claim.Value}");
                    }

                    var username = principal.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value;
                    var email = principal.Claims.FirstOrDefault(c => c.Type.Contains("emailaddress"))?.Value;

                    if (string.IsNullOrEmpty(username))
                    {
                        LogHelper.LogToFile("ID Token validation failed: No username claim found.");
                        return null;
                    }

                    return new UserInfo { Username = username, EMail = email };
                }
                catch (Exception ex)
                {
                    LogHelper.LogToFile($"ID Token validation failed: {ex}");
                    return null;
                }
            }
        }
    }
}