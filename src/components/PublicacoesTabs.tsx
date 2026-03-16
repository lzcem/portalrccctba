export interface Tab {
  value: string;
  label: string; // pode conter HTML
}

interface PublicacoesTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  tabs: Tab[];
}

export default function PublicacoesTabs({ activeTab, onTabChange, tabs }: PublicacoesTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
            ${
              activeTab === tab.value
                ? 'bg-green-600 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          dangerouslySetInnerHTML={{ __html: tab.label }}
        />
      ))}
    </div>
  );
}
