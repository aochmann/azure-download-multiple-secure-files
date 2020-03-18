const assert = require('assert');
const path = require('path');

// const mockRunnerTest = await import('azure-pipelines-task-lib/mock-test');
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';
const taskTestTimeout: number = 5000; //parseInt(process.env.TASK_TEST_TIMEOUT) || 20000;

describe('DownloadMultipleSecureFile Suite', () => {

  describe('Download Single Secure File', () => {
    it('Defaults: download secure file', () => {
      let tp: string = path.join(__dirname, 'L0SingleFile.js');
      let tr = new MockTestRunner(tp);

      tr.run();

      assert(tr.stderr.length === 0, 'should not have written to stderr');
      assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'), 'task should have used default retry count of 5');
      assert(tr.succeeded, 'task should have succeeded');
    });

    // it('Uses input retry count', () => {
    //   let tp: string = path.join(__dirname, 'L0ValidRetryCount.js');
    //   let tr: MockTestRunner = new MockTestRunner(tp);

    //   tr.run();

    //   assert(tr.stderr.length === 0, 'should not have written to stderr');
    //   assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 7'), 'task should have used the input retry count of 7');
    //   assert(tr.succeeded, 'task should have succeeded');
    // });

    // it('Invalid retry count defaults to 5', () => {
    //   let tp: string = path.join(__dirname, 'L0InvalidRetryCount.js');
    //   let tr: MockTestRunner = new MockTestRunner(tp);

    //   tr.run();

    //   assert(tr.stderr.length === 0, 'should not have written to stderr');
    //   assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count  set to: 5'), 'task should have used default retry count of 5');
    //   assert(tr.succeeded, 'task should have succeeded');
    // });

    // it('Negative retry count defaults to 5', () => {
    //   let tp: string = path.join(__dirname, 'L0NegativeRetryCount.js');
    //   let tr: MockTestRunner = new MockTestRunner(tp);

    //   tr.run();

    //   assert(tr.stderr.length === 0, 'should not have written to stderr');
    //   assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'), 'task should have used default retry count of 5');
    //   assert(tr.succeeded, 'task should have succeeded');
    // });
  });

  describe('Download Multiple Secure Files', () => {
    it('should be true', () => {
      assert(true === true);
    })
  });
}).timeout(taskTestTimeout);
