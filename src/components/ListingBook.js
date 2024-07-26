import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Table, Button, Modal } from 'antd';
import UpdateBook from './UpdateBook';

const GET_BOOKS = gql`
    query ShowBook {
      books {
        title
        id
        author {
          id  
          name
          age
        }
        created_at
        type
      }
}
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }`

const Books = ({ refetch }) => {
  const { loading, data } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author?.name,
      align: 'center',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (record) => (
        <>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
            setSelectedBook(record)
            setShowModal(true)
          }}>
            <a>Update</a>
          </Button>
          <Button type="default" onClick={() => {
            Modal.confirm({
              title: 'Do you want to delete this book?',
              centered: true,
              onOk() {
                deleteBook({ variables: { id: record.id } })
                refetch()
              },
            })
          }}
          >
            <a>Delete</a>
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        loading={loading}
        dataSource={data?.books}
        columns={columns}
        rowKey={(books) => books.id}
      />

      <UpdateBook
        book={selectedBook}
        open={showModal}
        closeModel={() => {
          setShowModal(false);
        }}
        onBookUpdated={() => refetch()}
      />
    </>
  );
};

export default Books;
