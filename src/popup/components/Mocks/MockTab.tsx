import { useEffect, useState } from 'react';
import Form from './AddMockForm';
import MockList from './MockList';
import { getAllMocks, saveMock } from '../../indexDB';
import type { Mock } from '../../../types';

export default function MockTab() {
  const [mocks, setMocks] = useState<Mock[]>([]);

  const loadMocks = async () => {
    const all = await getAllMocks();
    setMocks(all);
  };

  useEffect(() => {
    loadMocks();
  }, []);

  return (
    <>
      <Form onSubmit={saveMock} loadMocks={loadMocks} />
      <MockList mocks={mocks} setMocks={setMocks} loadMocks={loadMocks} />
    </>
  );
}
