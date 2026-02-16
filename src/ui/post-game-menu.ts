import { selectMenu, SelectOption } from './select';

export type PostGameChoice = 'continue' | 'home' | 'exit';

export async function showPostGameMenu(): Promise<PostGameChoice> {
  const options: SelectOption[] = [
    { name: '🔄 Continue to Play', value: 'continue' },
    { name: '🏠 Home', value: 'home' },
    { name: '🚪 Exit', value: 'exit' }
  ];

  const choice = await selectMenu(options, 0);
  return choice as PostGameChoice;
}






