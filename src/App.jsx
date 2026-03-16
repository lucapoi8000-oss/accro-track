import { useState } from 'react';
import { useStore } from './hooks/useStore';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AddictionsTab from './components/AddictionsTab';
import PositivesTab from './components/PositivesTab';
import BucketListTab from './components/BucketListTab';
import StatsTab from './components/StatsTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('addictions');
  const [data, update] = useStore();

  return (
    <>
      <Header />
      {activeTab === 'addictions' && <AddictionsTab data={data} update={update} />}
      {activeTab === 'positives' && <PositivesTab data={data} update={update} />}
      {activeTab === 'bucket' && <BucketListTab data={data} update={update} />}
      {activeTab === 'stats' && <StatsTab data={data} update={update} />}
      {activeTab === 'settings' && <SettingsTab data={data} update={update} />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
