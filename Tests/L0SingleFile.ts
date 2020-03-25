import { TaskLibAnswers } from 'azure-pipelines-task-lib/mock-answer';
import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';
import * as path from 'path';

const taskPath = path.join(__dirname, '..', 'preDownloadMultipleSecureFiles.js');
const mockTaskRunner: TaskMockRunner = new TaskMockRunner(taskPath);

mockTaskRunner.setInput('secureFiles', 'single-secure-file-id');

const secureFileHelperMock = require('securefiles-common/securefiles-common-mock');
mockTaskRunner.registerMock('securefiles-common/securefiles-common', secureFileHelperMock);

mockTaskRunner.registerMock('fs', {
  // @ts-ignore
  writeFileSync: (filePath, contents) => {}
});

let answer: TaskLibAnswers = {
  which: {
    cp: '/bin/cp'
  },
  checkPath: {
    '/bin/cp': true
  },
  exist: {
    '/build/temp/single-secure-file-id.filename': true
  }
} as TaskLibAnswers;

mockTaskRunner.setAnswers(answer);
mockTaskRunner.run();
