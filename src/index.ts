import dotenv from 'dotenv-safe';
import { cwd } from 'process';
import { CosmosClient } from '@azure/cosmos';
import { random } from 'lodash';

dotenv.config();

const key = process.env.COSMOS_KEY || '';
const endpoint = process.env.COSMOS_ENDPOINT || '';
const databaseId = process.env.COSMOS_DATABASE || '';
const container = process.env.COSMOS_CONTAINER || '';

const singletonClient = new CosmosClient({ endpoint, key });

async function main() {
  console.log('************ START ************');

  await executor(10);
  //await test();
  //await listDatabases();
  //await listContainers();
  console.log('************  END  ************');
}

async function listDatabases(client: CosmosClient = singletonClient) {
  const { resources: databases } = await client.databases.readAll().fetchAll();
  console.log(databases);
}

async function listContainers(client: CosmosClient = singletonClient) {
  console.log('************ listContainers ************');
  const { resources: containers } = await singletonClient.database(databaseId).containers.readAll().fetchAll();
  for (const container of containers) {
    console.log(container);
  }
}

async function listAllItemsInAContainer(client: CosmosClient = singletonClient) {
  console.log('************ listAllItemsInAContainer ************');
  const { resources: items } = await singletonClient
    .database(databaseId)
    .container(container)
    .items.readAll()
    .fetchAll();
  for (const item of items) {
    console.log(item);
  }
}

async function waitRandomInterval(min: number, max: number) {
  const waitTime = random(min, max);
  await new Promise((resolve) => setTimeout(resolve, waitTime * 100));
}

async function test() {
  console.log(`key: ${key}`);
  console.log(`endpoint: ${endpoint}`);
}

async function executor(n: number): Promise<void> {
  for (let i = 0; i < n; i++) {
    console.log(`************ Executor Num: ${i}/${n} ************`);
    await eachStep();
    await waitRandomInterval(1, 10);
  }
  console.log(`************ Executor DONE ************`);
}
async function eachStep(): Promise<void> {
  //const tempClient = new CosmosClient({ endpoint, key: key });
  const tempClient = singletonClient;
  await listDatabases(tempClient);
  await listContainers(tempClient);
  await listAllItemsInAContainer(tempClient);
}

main().catch((error) => {
  console.error(error);
});
