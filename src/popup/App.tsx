import { useState } from 'react';

import TabSwitcher from './components/Tabs/TabSwitcher';
import LogTab from './components/Logs/LogTab';
import MockTab from './components/Mocks/MockTab';

export default function App() {
  const [tab, setTab] = useState<'logs' | 'mocks'>('logs');

  return (
    <div
      style={{ padding: '16px', fontFamily: 'Arial, sans-serif', width: 400 }}
    >
      <TabSwitcher tab={tab} setTab={setTab} />
      {tab === 'logs' && <LogTab />}
      {tab === 'mocks' && <MockTab />}
    </div>
  );
}
