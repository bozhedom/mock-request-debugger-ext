import {
  saveMock,
} from '../../indexDB';
import Form from './Form';

interface FormProps {
  onSubmit: (url: string, json: string, enabled: boolean) => void;
  loadMocks: () => Promise<void>;
}

const AddMockForm = ({ loadMocks }: FormProps) => {

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: 24,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
        Добавить мок
      </h3>
      <Form onSubmit={saveMock} loadMocks={loadMocks} />
    </div>
  );
};

export default AddMockForm;
