import React from 'react';

import { IHealthData } from '../../types';

interface IProps {
  /** data 的描述 */
    data: IHealthData;
}

export const HealthDataDetails: React.FC<IProps> = ({ data }) => {
  return (
    <div className="health-details">
      <div className="detail-section">
        <h3></h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label>ID</label>
            <span>{datauserId}</span>
          </div>
          <div className="detail-item">
            <label></label>
            <span>{datatimestamptoLocaleString}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3></h3>
        <div className="detail-grid">
          <div className="detail-item">
            <label></label>
            <span>{datamentalHealthmood}/10</span>
          </div>
          <div className="detail-item">
            <label></label>
            <span>{datamentalHealthstressLevel}/10</span>
          </div>
          <div className="detail-item">
            <label></label>
            <span>{datamentalHealthanxiety}/10</span>
          </div>
        </div>
      </div>

      <style jsx>{
        healthdetails {
          padding 20px
        }

        detailsection {
          marginbottom 20px
          padding 15px
          border 1px solid eee
          borderradius 8px
        }

        detailgrid {
          display grid
          gridtemplatecolumns repeatautofit minmax200px 1fr
          gap 15px
        }

        detailitem {
          display flex
          flexdirection column
        }

        label {
          fontsize 09em
          color 666
          marginbottom 5px
        }

        span {
          fontsize 11em
          color 333
        }
      }</style>
    </div>
  );
}; 