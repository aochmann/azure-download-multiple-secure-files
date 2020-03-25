import assert = require('assert');
import * as path from 'path';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

const taskTestTimeout: number = parseInt(process.env.TASK_TEST_TIMEOUT as string) || 20000;
const taskJsonPath: string = path.join(__dirname, '..', 'task.json');

describe('DownloadMultipleSecureFile Suite', () => {
  describe('Retry Count', () => {
    it('Uses input retry count', () => {
      let taskPath: string = path.join(__dirname, 'L0ValidRetryCount.js');
      let taskRunner: MockTestRunner = new MockTestRunner(taskPath, taskJsonPath);

      taskRunner.run();

      assert(taskRunner.stderr.length === 0, 'should not have written to stderr');
      assert(
        taskRunner.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 7'),
        'task should have used the input retry count of 7'
      );
      assert(taskRunner.succeeded, 'task should have succeeded');
    });

    it('Invalid retry count defaults to 5', () => {
      let taskPath: string = path.join(__dirname, 'L0InvalidRetryCount.js');
      let taskRunner: MockTestRunner = new MockTestRunner(taskPath, taskJsonPath);

      taskRunner.run();

      assert(taskRunner.stderr.length === 0, 'should not have written to stderr');
      assert(
        taskRunner.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'),
        'task should have used default retry count of 5'
      );
      assert(taskRunner.succeeded, 'task should have succeeded');
    });

    it('Negative retry count defaults to 5', () => {
      let taskPath: string = path.join(__dirname, 'L0NegativeRetryCount.js');
      let taskRunner: MockTestRunner = new MockTestRunner(taskPath, taskJsonPath);

      taskRunner.run();

      assert(taskRunner.stderr.length === 0, 'should not have written to stderr');
      assert(
        taskRunner.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'),
        'task should have used default retry count of 5'
      );
      assert(taskRunner.succeeded, 'task should have succeeded');
    });
  });

  describe('Download Single Secure File', () => {
    it('Defaults: download secure file', () => {
      const taskPath: string = path.join(__dirname, 'L0SingleFile.js');
      const taskRunner: MockTestRunner = new MockTestRunner(taskPath, taskJsonPath);

      taskRunner.run();

      assert(taskRunner.stderr.length === 0, 'should not have written to stderr');
      assert(
        taskRunner.stdOutContained('##vso[task.debug]Mock SecureFileHelpers retry count set to: 5'),
        'task should have used default retry count of 5'
      );
      assert(taskRunner.succeeded, 'task should have succeeded');
    });
  });

  describe('Download Multiple Secure Files', () => {
    it('Comma Delimiter: download secure files', () => {
      const taskPath: string = path.join(__dirname, 'L0MultipleFilesCommaDelimiter.js');
      const taskRunner: MockTestRunner = new MockTestRunner(taskPath, taskJsonPath);

      taskRunner.run();

      assert(
        taskRunner.stdOutContained(
          '##vso[task.setvariable variable=secureFilePaths;issecret=false;]/build/temp/single-secure-file-0.filename,/build/temp/single-secure-file-1.filename'
        ),
        'task should have set output variable with file paths'
      );
      assert(taskRunner.succeeded, 'task should have succeeded');
    });

    it('New Line Delimiter: download secure files', () => {
      const taskPath: string = path.join(__dirname, 'L0MultipleFilesNewLineDelimiter.js');
      const taskRunner: MockTestRunner = new MockTestRunner(taskPath, taskJsonPath);

      taskRunner.run();

      assert(
        taskRunner.stdOutContained(
          '##vso[task.setvariable variable=secureFilePaths;issecret=false;]/build/temp/single-secure-file-0.filename,/build/temp/single-secure-file-1.filename'
        ),
        'task should have set output variable with file paths'
      );
      assert(taskRunner.succeeded, 'task should have succeeded');
    });
  });
}).timeout(taskTestTimeout);
