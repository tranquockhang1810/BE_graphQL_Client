import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { gql, useMutation, useQuery } from '@apollo/client';

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String!, $authorId: ID!, $type: String!) {
    updateBook(id: $id, title: $title, authorId: $authorId, type: $type) {
      id
      title
      author {
        name
      }
      type
    }
  }
`;

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
    }
  }
`;

export default function UpdateBook({ book = {}, open, closeModel, onBookUpdated }) {
  const [updateBook] = useMutation(UPDATE_BOOK);
  const [form] = Form.useForm();
  const { loading, data } = useQuery(GET_AUTHORS);

  const handleSubmit = async (values) => {
    try {
      const id = book?.id;
      const { title, authorId, type } = values;
      const res = await updateBook({ variables: { id, title, authorId, type } });
      if (res.data) {
        onBookUpdated();
        form.resetFields();
        closeModel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      title: book?.title,
      type: book?.type,
      authorId: book?.author?.id
    });
  }, [book, open]);

  return (
    <Modal
      title="Update Book"
      open={open}
      onCancel={closeModel}
      centered
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
        >
          <Input
            placeholder="Enter book title"
          />
        </Form.Item>
        <Form.Item
          label="Author"
          name="authorId"
        >
          <Select
            loading={loading}
            placeholder="Select author"
            options={data?.authors.map((author) => ({
              value: author.id,
              label: author.name
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
        >
          <Input
            placeholder="Enter book type"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Update Book</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
