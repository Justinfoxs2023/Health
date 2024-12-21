/**
 * @fileoverview TS 文件 experience-base.interface.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

export interface IExperienceBaseService {
   
  /** trackUserBehaviorevent 的描述 */
    trackUserBehaviorevent: string, /** data 的描述 */
    /** data 的描述 */
    data: any: /** void 的描述 */
    /** void 的描述 */
    void;

   
  /** monitorPerformance 的描述 */
    monitorPerformance: void;

   
  /** reportErrorerror 的描述 */
    reportErrorerror: Error: /** void 的描述 */
    /** void 的描述 */
    void;

   
  /** collectFeedbackfeedback 的描述 */
    collectFeedbackfeedback: any: /** Promisevoid 的描述 */
    /** Promisevoid 的描述 */
    Promisevoid;

   
  /** recordSatisfactionScorescore 的描述 */
    recordSatisfactionScorescore: number: /** void 的描述 */
    /** void 的描述 */
    void;

   
  /** getUserExperienceReport 的描述 */
    getUserExperienceReport: Promiseany;
}
