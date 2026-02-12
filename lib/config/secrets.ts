/**
 * 시크릿 관리 모듈
 *
 * DB 비밀번호, API 키 등은 코드에 하드코딩하지 않고
 * 이 모듈을 통해서만 접근합니다.
 *
 * TODO: Azure 승인 후, KEY_VAULT_URL 있을 때 Key Vault에서 조회하도록 확장
 */

export type SecretKey =
  | "DATABASE_URL"
  | "SESSION_SECRET"
  | "KEY_VAULT_URL"
  | "AZURE_AD_CLIENT_ID"
  | "AZURE_AD_CLIENT_SECRET"
  | "AZURE_AD_TENANT_ID"
  | "OIDC_CLIENT_ID"
  | "OIDC_CLIENT_SECRET"
  | "PROXY_LOGOUT_URL";

/**
 * 시크릿 값 조회
 *
 * @param key - 환경 변수 key
 * @returns 시크릿 값 또는 undefined (미설정 시)
 */
export function getSecret(key: SecretKey): string | undefined {
  // TODO: Azure 승인 후, KEY_VAULT_URL 있을 때 @azure/keyvault-secrets 사용
  // const keyVaultUrl = process.env.KEY_VAULT_URL;
  // if (keyVaultUrl) {
  //   const client = new SecretClient(keyVaultUrl, new DefaultAzureCredential());
  //   const secret = await client.getSecret(key);
  //   return secret.value;
  // }
  return process.env[key];
}
