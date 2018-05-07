import React from 'react';

export default function BottomArea(props){
    return (
      <div className="bottom-area">
        提交的数据为：
        <div className="data-wrap">
          {JSON.stringify(props.datas || '')}
        </div>
      </div>
    );
}

