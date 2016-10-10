import React, { PropTypes } from 'react';
import Chrome from './Chrome';

const App = ({ children }) =>
    <div>
        <Chrome />
        { children }
    </div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;

