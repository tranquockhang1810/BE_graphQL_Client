import React from 'react'
import { useQuery, gql, useMutation } from '@apollo/client';
import { Table, Button, Modal } from 'antd';
import UpdateAuthor from './UpdateAuthor';

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      nation
      age
    }
  }
`;

const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id) {
      id
    }
  }`

export default function Authors({ refetch }) {
  const { loading, data } = useQuery(GET_AUTHORS);
  const [deleteAuthor] = useMutation(DELETE_AUTHOR);
  const [selectedAuthor, setSelectedAuthor] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    },
    {
      title: 'Nation',
      dataIndex: 'nation',
      key: 'nation',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (record) => (
        <>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
            setSelectedAuthor(record)
            setShowModal(true)
          }}>
            <a>Update</a>
          </Button>
          <Button type="default" onClick={() => {
            Modal.confirm({
              title: 'Do you want to delete this author?',
              centered: true,
              onOk() {
                deleteAuthor({ variables: { id: record.id } })
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
        dataSource={data?.authors}
        columns={columns}
        rowKey={(author) => author.id}
      />

      <UpdateAuthor
        author={selectedAuthor}
        open={showModal}
        closeModel={() => setShowModal(false)}
        onAuthorUpdated={() => refetch()}
      />
    </>
  );
}
