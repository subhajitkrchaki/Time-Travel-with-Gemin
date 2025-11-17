
export enum AppMode {
  Edit = 'edit',
  Analyze = 'analyze',
}

export interface GeneratedContent {
  type: 'image' | 'text';
  data: string;
}
