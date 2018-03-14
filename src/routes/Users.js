import React from 'react';
import { connect } from 'dva';
import styles from './Users.css';
import UsersList from '../components/Users/Users'
function Users() {
  return (
    <div className={styles.normal}>
      <UsersList />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Users);
