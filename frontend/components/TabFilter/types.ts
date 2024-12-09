export interface Tab {
  id: string;
  name: string;
}

export interface Props {
  tabs: Tab[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
} 