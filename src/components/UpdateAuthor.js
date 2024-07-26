import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, InputNumber } from 'antd';
import { gql, useMutation } from '@apollo/client';

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $name: String!, $age: Int!, $nation: String!) {
    updateAuthor(id: $id, name: $name, age: $age, nation: $nation) {
      id
      name
      age
      nation
    }
  }
`;

export default function UpdateAuthor({ author = {}, open, closeModel, onAuthorUpdated }) {
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const id = author?.id;
      const { name, age, nation } = values;
      const res = await updateAuthor({ variables: { id, name, age, nation } });
      if (res.data) {
        onAuthorUpdated();
        form.resetFields();
        closeModel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      name: author?.name,
      age: author?.age,
      nation: author?.nation
    });
  }, [author, open]);

  return (
    <Modal
      title="Update Author"
      open={open}
      onCancel={closeModel}
      centered
      footer={null}
    >
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
    </Modal>
  )
}
