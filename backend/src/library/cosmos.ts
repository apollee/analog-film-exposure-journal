import { CosmosClient } from "@azure/cosmos";
import { ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

let client: CosmosClient | null = null;
let cosmosConfigPromise: Promise<{ endpoint: string; key: string }> | null = null;

async function loadCosmosConfig(): Promise<{ endpoint: string; key: string }> {
  const vaultUrl = process.env.KEY_VAULT_URL;
  const endpointSecretName = process.env.COSMOS_ENDPOINT_SECRET_NAME;
  const keySecretName = process.env.COSMOS_KEY_SECRET_NAME;

  if (!vaultUrl) throw new Error("Missing KEY_VAULT_URL.");
  if (!endpointSecretName || !keySecretName) {
    throw new Error("Missing COSMOS_ENDPOINT_SECRET_NAME or COSMOS_KEY_SECRET_NAME.");
  }

  console.log("[cosmos] MI env", {
    hasIdentityEndpoint: !!process.env.IDENTITY_ENDPOINT,
    hasIdentityHeader: !!process.env.IDENTITY_HEADER,
    hasMsiEndpoint: !!process.env.MSI_ENDPOINT,
    hasMsiSecret: !!process.env.MSI_SECRET,
  });

  const credential = new ManagedIdentityCredential();

  await credential.getToken("https://vault.azure.net/.default");

  const secretClient = new SecretClient(vaultUrl, credential);

  const [endpointSecret, keySecret] = await Promise.all([
    secretClient.getSecret(endpointSecretName),
    secretClient.getSecret(keySecretName),
  ]);

  const endpoint = endpointSecret.value;
  const key = keySecret.value;

  if (!endpoint || !key) {
    throw new Error("Key Vault returned empty Cosmos secrets.");
  }

  return { endpoint, key };
}

async function getClient(): Promise<CosmosClient> {
  if (client) return client;

  if (!cosmosConfigPromise) {
    cosmosConfigPromise = loadCosmosConfig();
  }

  const { endpoint, key } = await cosmosConfigPromise;
  client = new CosmosClient({ endpoint, key });

  return client;
}

export async function getRollsContainer() {
  const databaseName = process.env.COSMOS_DATABASE_NAME;
  const containerName = process.env.COSMOS_ROLLS_CONTAINER;

  if (!databaseName || !containerName) {
    throw new Error("Missing COSMOS_DATABASE_NAME or COSMOS_ROLLS_CONTAINER.");
  }

  const db = (await getClient()).database(databaseName);
  return db.container(containerName);
}

export async function getFramesContainer() {
  const databaseName = process.env.COSMOS_DATABASE_NAME;
  const containerName = process.env.COSMOS_FRAMES_CONTAINER;

  if (!databaseName || !containerName) {
    throw new Error("Missing COSMOS_DATABASE_NAME or COSMOS_FRAMES_CONTAINER.");
  }

  const db = (await getClient()).database(databaseName);
  return db.container(containerName);
}
