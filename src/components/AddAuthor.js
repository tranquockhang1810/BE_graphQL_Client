import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Button, Form, Input, InputNumber } from 'antd';

const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!, $age: Int!, $nation: String!) {
    addAuthor(name: $name, age: $age, nation: $nation) {
      id
      name
      age
      nation
    }
  }
`;

export default function AddAuthor({ onAuthorAdded }) {
  const [addAuthor] = useMutation(ADD_AUTHOR);
  const [form] = Form.useForm();
  const [showForm, setShowForm] = React.useState(false);

  const handleSubmit = async (values) => {
    try {
      const { name, age, nation } = values;
      const res = await addAuthor({ variables: { name, age, nation } });
      if (res.data) {
        onAuthorAdded();
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {showForm && (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
          >
            <Input
              placeholder="Enter author name"
            />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter author age"
            />
          </Form.Item>
          <Form.Item
            label="Nation"
            name="nation"
          >
            <Input
              placeholder="Enter author nation"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Add Author</Button>
          </Form.Item>
        </Form>
      )}
      <Button type="default" style={{ width: '100%' }} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Author'}
      </Button>
    </>
  );
}
