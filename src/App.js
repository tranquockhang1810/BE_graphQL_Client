import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Books from './components/ListingBook';
import AddBook from './components/AddBook';
import { Tabs } from 'antd';
import Authors from './components/Authors';
import AddAuthor from './components/AddAuthor';

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

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      nation
    }
  }
`;

const App = () => {
  //add alias for refetch
  const [selectedKey, setSelectedKey] = React.useState('1');
  const { refetch } = useQuery(selectedKey === '1' ? GET_BOOKS : GET_AUTHORS);

  return (
    <div style={{ margin: "0 80px" }}>
      <h1>GraphQL React Client</h1>
      <Tabs
        onChange={(key) => setSelectedKey(key)}
        defaultActiveKey="1"
        items={[
          {
            label: 'Books',
            key: '1',
            children: <>
              <AddBook onBookAdded={refetch} />
              <h1>Books</h1>
              <Books refetch={refetch} />
            </>
          },
          {
            label: 'Authors',
            key: '2',
            children: <>
            <AddAuthor onAuthorAdded={refetch} />
              <h1>Authors</h1>
              <Authors refetch={refetch}/>
            </>
          },
        ]}
      />

    </div>
  )
};

export default App;
