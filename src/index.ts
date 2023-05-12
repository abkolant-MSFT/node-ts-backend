import dotenv from 'dotenv-safe';
//import { cwd } from 'process';
import { CosmosClient } from '@azure/cosmos';
import { HttpsProxyAgent } from 'https-proxy-agent';

dotenv.config();

const key = process.env.COSMOS_KEY || '';
const endpoint = process.env.COSMOS_ENDPOINT || '';
const databaseId = process.env.COSMOS_DATABASE || '<cosmos database>';

//For Fiddler
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:8888');
const client = new CosmosClient({ endpoint, key, agent: proxyAgent });

async function main() {
  console.log('************ START ************');

  //await test();
  await listDatabases();
  //await listContainers();
  console.log('************  END  ************');
}

async function listDatabases() {
  const { resources: databases } = await client.databases.readAll().fetchAll();
  console.log(databases);
}

async function listContainers() {
  console.log('************ listContainers ************');
  const { resources: containers } = await client.database(databaseId).containers.readAll().fetchAll();
  for (const container of containers) {
    console.log(container);
  }
}

async function test() {
  console.log(`key: ${key}`);
  console.log(`endpoint: ${endpoint}`);
}

main().catch((error) => {
  console.error(error);
});
