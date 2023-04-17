import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppBox } from '../../store/progress';

interface Box {
  data: AppBox;
  answers: (string | boolean)[][];
}

interface StorageBox {
  [key: string]: Box;
}

async function readBox(): Promise<StorageBox> {
  const value = await AsyncStorage.getItem('BOX');
  return JSON.parse(value ?? '{}');
}

async function saveBox(box: StorageBox) {
  await AsyncStorage.setItem('BOX', JSON.stringify(box));
}

async function insertBox(data: AppBox) {
  const box = await readBox();

  if (box[data.module]?.data.createdAt != data.createdAt) {
    box[data.module] = {
      data: data,
      answers: []
    }
  }

  await saveBox(box);
}

async function getBox(module: string): Promise<Box | undefined> {
  const box = await readBox();
  return box[module] ?? undefined;
}

async function deleteBox(module: string) {
  const box = await readBox();
  delete box[module];
  await saveBox(box);
}

async function addAnswers(module: string, answers: (boolean | string)[]) {
  const box = await readBox();
  if (!box[module]) return;
  box[module].answers.push(answers);
  await saveBox(box);
}

export { addAnswers, insertBox, deleteBox, getBox, StorageBox, readBox };