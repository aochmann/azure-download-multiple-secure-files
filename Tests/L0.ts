import * as mockAzureTask from 'azure-pipelines-task-lib/mock-test';

const assert = require('assert');
const path = require('path');

describe('DownloadMultipleSecureFile Suite', () => {
  const taskTestTimeout = parseInt(process.env.TASK_TEST_TIMEOUT) || 20000;

  this.beforeEach(() => {
    this.timeout(taskTestTimeout);
  });

  describe('Download Single Secure File', () => {
    it('Defaults: download secure file', () => {
      let tp: string = path.join(__dirname, 'L0SecureFile.js');
      let tr: mockAzureTask.MockTestRunner = new mockAzureTask.MockTestRunner(tp);

      tr.run();

      assert(tr.stderr.length === 0, 'should not have written to stderr');
      assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'), 'task should have used default retry count of 5');
      assert(tr.succeeded, 'task should have succeeded');
    });

    it('Uses input retry count', () => {
      let tp: string = path.join(__dirname, 'L0ValidRetryCount.js');
      let tr: mockAzureTask.MockTestRunner = new mockAzureTask.MockTestRunner(tp);

      tr.run();

      assert(tr.stderr.length === 0, 'should not have written to stderr');
      assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 7'), 'task should have used the input retry count of 7');
      assert(tr.succeeded, 'task should have succeeded');
    });

    it('Invalid retry count defaults to 5', () => {
      let tp: string = path.join(__dirname, 'L0InvalidRetryCount.js');
      let tr: mockAzureTask.MockTestRunner = new mockAzureTask.MockTestRunner(tp);

      tr.run();

      assert(tr.stderr.length === 0, 'should not have written to stderr');
      assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'), 'task should have used default retry count of 5');
      assert(tr.succeeded, 'task should have succeeded');
    });

    it('Negative retry count defaults to 5', () => {
      let tp: string = path.join(__dirname, 'L0NegativeRetryCount.js');
      let tr: mockAzureTask.MockTestRunner = new mockAzureTask.MockTestRunner(tp);

      tr.run();

      assert(tr.stderr.length === 0, 'should not have written to stderr');
      assert(tr.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'), 'task should have used default retry count of 5');
      assert(tr.succeeded, 'task should have succeeded');
    });
  });

  describe('Download Multiple Secure Files', () => {});
});
