const _ = require('lodash');
const utils = require('./utils');
const _schema = require('spreadable/src/schema');
const schema = Object.assign({}, _schema);

schema.getStatusResponse = function () {
  return _.merge(_schema.getStatusResponse(), {
    props: {
      total: 'number',
      available: 'number',
      allowed: 'number',
      used: 'number',
      free: 'number',
      clean: 'number',
      tempAllowed: 'number',
      tempUsed: 'number',
      tempFree: 'number',
      fileMaxSize: 'number',
      filesCount: 'number'
    }
  })
};

schema.getStatusPrettyResponse = function () {
  return _.merge(this.getStatusResponse(), _schema.getStatusPrettyResponse(), {
    props: {
      total: 'string',
      available: 'string',
      allowed: 'string',
      used: 'string',
      free: 'string',
      clean: 'string',
      tempAllowed: 'string',
      tempUsed: 'string',
      tempFree: 'string',
      fileMaxSize: 'string',
    }    
  });
};

schema.getFileExistenceInfo = function() {
  return {
    type: 'object',
    props: {
      hash: 'string',
      size: 'number',
      mime: 'string',
      ext: 'string',
      storage: 'object'
    },
    required: ['hash', 'size'],
    expected: true,
    canBeNull: true
  }
};

schema.getFileLink = function () {
  return {
    type: 'string',
    value: val => val == '' || utils.isValidFileLink(val)
  };
};

schema.getFileStoringResponse = function () {
  return {
    type: 'object',
    props: {
      address: this.getAddress(),
      hash: 'string',
      link: this.getFileLink()
    },
    strict: true
  }
};

schema.getFileStoringInfoSlaveResponse = function () {
  return {
    type: 'object',
    props: {
      address: this.getAddress(),
      free: 'number',
      isAvailable: 'boolean',
      existenceInfo: this.getFileExistenceInfo()
    },
    strict: true
  }
};

schema.getFileStoringCandidatesMasterResponse = function (options = {}) {
  const address = this.getAddress();

  return {
    type: 'object',
    props: {
      address,
      candidates: {
        type: 'array',
        items: this.getFileStoringInfoSlaveResponse(),
        maxLength: options.networkOptimum
      },
      existing: {
        type: 'array',
        items: {
          type: 'object',
          props: {
            address,
            existenceInfo: this.getFileExistenceInfo() 
          },
          strict: true
        }
      }
    },
    strict: true
  }
};

schema.getFileLinksSlaveResponse = function () {
  return {
    type: 'object',
    props: {
      address: this.getAddress(),
      link: this.getFileLink()
    },
    strict: true
  }
};

schema.getFileLinksMasterResponse = function (options = {}) {
  return {
    type: 'object',
    props: {
      address: this.getAddress(),
      links: {
        type: 'array',
        items: this.getFileLinksSlaveResponse(),
        maxLength: options.networkOptimum
      }
    },
    strict: true
  }
};

schema.getFileRemovalMasterResponse = function () {
  return {
    type: 'object',
    props: {
      address: this.getAddress(),
      removed: 'number'
    },
    strict: true
  }
};

schema.getFileRemovalSlaveResponse = function () {
  return {
    type: 'object',
    props: {
      address: this.getAddress(),
      removed: 'boolean'
    },
    strict: true
  }
};

module.exports = schema;