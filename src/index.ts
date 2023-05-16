import dotenv from 'dotenv-safe';
import { cwd } from 'process';
import { CosmosClient } from '@azure/cosmos';

dotenv.config();

const key = process.env.COSMOS_KEY || '';
const endpoint = process.env.COSMOS_ENDPOINT || '';
const databaseId = process.env.COSMOS_DATABASE || '<cosmos database>';

const singleTonClient = new CosmosClient({ endpoint, key });

async function main() {
  console.log('************ START ************');

  await foo(5);
  //await test();
  //await listDatabases();
  //await listContainers();
  console.log('************  END  ************');
}

async function listDatabases(client: CosmosClient = singleTonClient) {
  const { resources: databases } = await client.databases.readAll().fetchAll();
  console.log(databases);
}

async function listContainers() {
  console.log('************ listContainers ************');
  const { resources: containers } = await singleTonClient.database('adventure-works').containers.readAll().fetchAll();
  for (const container of containers) {
    console.log(container);
  }
}

async function test() {
  console.log(`key: ${key}`);
  console.log(`endpoint: ${endpoint}`);
}

async function foo(n: number): Promise<void> {
  for (let i = 0; i < n; i++) {
    await bar();
  }
}
async function bar(): Promise<void> {
  const tempClient = new CosmosClient({ endpoint, key });
  await listDatabases(tempClient);
}

main().catch((error) => {
  console.error(error);
});
