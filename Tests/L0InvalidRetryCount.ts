import * as mockAnswer from 'azure-pipelines-task-lib/mock-answer';
import * as mockRun from 'azure-pipelines-task-lib/mock-run';

const secureFileHelperMock = require('securefiles-common/securefiles-common-mock');
const path = require('path');

const taskPath = path.join(__dirname, '..', 'preDownloadMultipleSecureFiles.js');
const mockTaskRunner: mockRun.TaskMockRunner = new mockRun.TaskMockRunner(taskPath);

mockTaskRunner.setInput('secureFiles', 'single-secure-file-id');

mockTaskRunner.registerMock('securefiles-common/securefiles-common', secureFileHelperMock);

mockTaskRunner.registerMock('fs', {
  writeFileSync: (filePath, contents) => null
});

let answer: mockAnswer.TaskLibAnswers = <mockAnswer.TaskLibAnswers>{
    "which": {
        "cp": "/bin/cp"
    },
    "checkPath": {
        "/bin/cp": true
    },
    "exist": {
        "/build/temp/single-secure-file-id.filename": true
    }
};

mockTaskRunner.setAnswers(answer);
mockTaskRunner.run();

