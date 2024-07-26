import React from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Button, Form, Input, Select } from 'antd';

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $authorId: ID!, $type: String!) {
    addBook(title: $title, authorId: $authorId, type: $type) {
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

const AddBook = ({ onBookAdded }) => {
  const [addBook] = useMutation(ADD_BOOK);
  const { loading, data } = useQuery(GET_AUTHORS);
  const [form] = Form.useForm();
  const [showForm, setShowForm] = React.useState(false);

  const handleSubmit = async (values) => {
    try {
      const { title, authorId, type } = values;
      const res = await addBook({ variables: { title, authorId, type } });
      if (res.data) {
        onBookAdded();
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
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Add Book</Button>
          </Form.Item>
        </Form>
      )}
      <Button type="default" style={{ width: '100%' }} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Book'}
      </Button>
    </>
  );
};

export default AddBook;
