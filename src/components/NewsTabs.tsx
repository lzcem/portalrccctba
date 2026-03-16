// src/components/NewsTabs.tsx

export interface Tab {
  value: string;
  label: string;  // pode conter HTML
}

interface NewsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  tabs: Tab[];
}

export default function NewsTabs({ activeTab, onTabChange, tabs }: NewsTabsProps) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
            ${
              activeTab === tab.value
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          // Para inserir HTML na label com segurança, considere sanitizar!
          dangerouslySetInnerHTML={{ __html: tab.label }}
        />
      ))}
    </div>
  );
}
