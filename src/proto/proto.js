/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  chatroom: {
    nested: {
      ChatMessage: {
        fields: {
          uuid: {
            type: "string",
            id: 1,
            options: {
              "(webaas.db.record.field).primary_key": true
            }
          },
          userID: {
            type: "string",
            id: 2
          },
          content: {
            type: "string",
            id: 3
          },
          privateID: {
            type: "string",
            id: 4
          },
          date: {
            type: "string",
            id: 5
          }
        }
      },
      ChatPerson: {
        fields: {
          userID: {
            type: "string",
            id: 1,
            options: {
              "(webaas.db.record.field).primary_key": true
            }
          },
          userName: {
            type: "string",
            id: 2
          },
          avatar: {
            type: "string",
            id: 3
          },
          preUUID: {
            type: "string",
            id: 4
          },
          msgNum: {
            type: "string",
            id: 5
          }
        }
      },
      ChatroomStatus: {
        fields: {
          roomID: {
            type: "string",
            id: 1,
            options: {
              "(webaas.db.record.field).primary_key": true
            }
          },
          peopleNum: {
            type: "string",
            id: 2
          }
        }
      }
    }
  },
  webaas: {
    nested: {
      db: {
        nested: {
          record: {
            nested: {
              SchemaOptions: {
                fields: {
                  splitLongRecords: {
                    type: "bool",
                    id: 3
                  },
                  storeRecordVersions: {
                    type: "bool",
                    id: 4
                  }
                }
              },
              schema: {
                type: "SchemaOptions",
                id: 1233,
                extend: "google.protobuf.FileOptions"
              },
              FieldOptions: {
                fields: {
                  primaryKey: {
                    type: "bool",
                    id: 1
                  },
                  index: {
                    type: "IndexOption",
                    id: 2
                  }
                },
                nested: {
                  IndexOption: {
                    fields: {
                      type: {
                        type: "string",
                        id: 1
                      },
                      unique: {
                        type: "bool",
                        id: 2
                      },
                      options: {
                        rule: "repeated",
                        type: "Index.Option",
                        id: 3
                      }
                    }
                  }
                }
              },
              field: {
                type: "FieldOptions",
                id: 1233,
                extend: "google.protobuf.FieldOptions"
              },
              DataStoreInfo: {
                fields: {
                  formatVersion: {
                    type: "int32",
                    id: 1
                  },
                  metaDataversion: {
                    type: "int32",
                    id: 2
                  },
                  userVersion: {
                    type: "int32",
                    id: 3
                  },
                  recordCountKey: {
                    type: "KeyExpression",
                    id: 4
                  },
                  lastUpdateTime: {
                    type: "uint64",
                    id: 5
                  },
                  omitUnsplitRecordSuffix: {
                    type: "bool",
                    id: 6
                  },
                  cacheable: {
                    type: "bool",
                    id: 7
                  },
                  userField: {
                    rule: "repeated",
                    type: "UserFieldEntry",
                    id: 8
                  }
                },
                nested: {
                  UserFieldEntry: {
                    fields: {
                      key: {
                        type: "string",
                        id: 1
                      },
                      value: {
                        type: "bytes",
                        id: 2
                      }
                    }
                  }
                }
              },
              Index: {
                fields: {
                  recordType: {
                    rule: "repeated",
                    type: "string",
                    id: 1
                  },
                  name: {
                    type: "string",
                    id: 2
                  },
                  rootExpression: {
                    type: "KeyExpression",
                    id: 3
                  },
                  subspaceKey: {
                    type: "bytes",
                    id: 4
                  },
                  lastModifiedVersion: {
                    type: "int32",
                    id: 5
                  },
                  type: {
                    type: "string",
                    id: 6
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 7
                  },
                  addedVersion: {
                    type: "int32",
                    id: 8
                  },
                  unique: {
                    type: "bool",
                    id: 9
                  }
                },
                nested: {
                  Option: {
                    fields: {
                      key: {
                        type: "string",
                        id: 1
                      },
                      value: {
                        type: "string",
                        id: 2
                      }
                    }
                  }
                }
              },
              RecordType: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  primaryKey: {
                    type: "KeyExpression",
                    id: 2
                  },
                  sinceVersion: {
                    type: "int32",
                    id: 3
                  },
                  explicitKey: {
                    type: "google.protobuf.Any",
                    id: 4
                  }
                }
              },
              FormerIndex: {
                fields: {
                  formerName: {
                    type: "string",
                    id: 3
                  },
                  subspaceKey: {
                    type: "bytes",
                    id: 5
                  },
                  removedVersion: {
                    type: "int32",
                    id: 6
                  },
                  addedVersion: {
                    type: "int32",
                    id: 10
                  }
                }
              },
              MetaData: {
                fields: {
                  recordDescriptor: {
                    type: "google.protobuf.DescriptorProto",
                    id: 1
                  },
                  indexes: {
                    rule: "repeated",
                    type: "Index",
                    id: 2
                  },
                  recordTypes: {
                    rule: "repeated",
                    type: "RecordType",
                    id: 3
                  },
                  splitLongRecords: {
                    type: "bool",
                    id: 4
                  },
                  version: {
                    type: "int32",
                    id: 5
                  },
                  formerIndexes: {
                    rule: "repeated",
                    type: "FormerIndex",
                    id: 6
                  },
                  storeRecordVersions: {
                    type: "bool",
                    id: 7
                  },
                  subspaceKeyCounter: {
                    type: "int64",
                    id: 9
                  },
                  usesSubspaceKeyCounter: {
                    type: "bool",
                    id: 10
                  },
                  joinedRecordTypes: {
                    rule: "repeated",
                    type: "JoinedRecordType",
                    id: 11
                  }
                }
              },
              Then: {
                fields: {
                  child: {
                    rule: "repeated",
                    type: "KeyExpression",
                    id: 1
                  }
                }
              },
              List: {
                fields: {
                  child: {
                    rule: "repeated",
                    type: "KeyExpression",
                    id: 1
                  }
                }
              },
              Field: {
                fields: {
                  fieldName: {
                    type: "string",
                    id: 1
                  },
                  fanType: {
                    type: "FanType",
                    id: 2
                  },
                  nullInterpretation: {
                    type: "NullInterpretation",
                    id: 3
                  }
                },
                nested: {
                  FanType: {
                    values: {
                      FAN_ERROR: 0,
                      SCALAR: 1,
                      FAN_OUT: 2,
                      CONCATENATE: 3
                    }
                  },
                  NullInterpretation: {
                    values: {
                      NULL_ERROR: 0,
                      NOT_UNIQUE: 1,
                      UNIQUE: 2,
                      NOT_NULL: 3
                    }
                  }
                }
              },
              Nesting: {
                fields: {
                  parent: {
                    type: "Field",
                    id: 1
                  },
                  child: {
                    type: "KeyExpression",
                    id: 2
                  }
                }
              },
              Grouping: {
                fields: {
                  wholeKey: {
                    type: "KeyExpression",
                    id: 1
                  },
                  groupedCount: {
                    type: "int32",
                    id: 3
                  }
                }
              },
              KeyWithValue: {
                fields: {
                  innerKey: {
                    type: "KeyExpression",
                    id: 1
                  },
                  splitPoint: {
                    type: "int32",
                    id: 2
                  }
                }
              },
              Split: {
                fields: {
                  joined: {
                    type: "KeyExpression",
                    id: 1
                  },
                  splitSize: {
                    type: "int32",
                    id: 2
                  }
                }
              },
              Empty: {
                fields: {}
              },
              Version: {
                fields: {}
              },
              RecordTypeKey: {
                fields: {}
              },
              Function: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  "arguments": {
                    type: "KeyExpression",
                    id: 2
                  }
                }
              },
              KeyExpression: {
                oneofs: {
                  expression: {
                    oneof: [
                      "then",
                      "nesting",
                      "field",
                      "grouping",
                      "empty",
                      "split",
                      "version",
                      "value",
                      "function",
                      "keyWithValue",
                      "recordTypeKey",
                      "list"
                    ]
                  }
                },
                fields: {
                  then: {
                    type: "Then",
                    id: 1
                  },
                  nesting: {
                    type: "Nesting",
                    id: 2
                  },
                  field: {
                    type: "Field",
                    id: 3
                  },
                  grouping: {
                    type: "Grouping",
                    id: 4
                  },
                  empty: {
                    type: "Empty",
                    id: 5
                  },
                  split: {
                    type: "Split",
                    id: 6
                  },
                  version: {
                    type: "Version",
                    id: 7
                  },
                  value: {
                    type: "google.protobuf.Any",
                    id: 8
                  },
                  "function": {
                    type: "Function",
                    id: 9
                  },
                  keyWithValue: {
                    type: "KeyWithValue",
                    id: 10
                  },
                  recordTypeKey: {
                    type: "RecordTypeKey",
                    id: 11
                  },
                  list: {
                    type: "List",
                    id: 12
                  }
                }
              },
              JoinedRecordType: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  recordTypeKey: {
                    type: "google.protobuf.Any",
                    id: 4
                  },
                  joinConstituents: {
                    rule: "repeated",
                    type: "JoinConstituent",
                    id: 10
                  },
                  joins: {
                    rule: "repeated",
                    type: "Join",
                    id: 11
                  }
                },
                nested: {
                  JoinConstituent: {
                    fields: {
                      name: {
                        type: "string",
                        id: 1
                      },
                      recordType: {
                        type: "string",
                        id: 2
                      },
                      outerJoined: {
                        type: "bool",
                        id: 3
                      }
                    }
                  },
                  Join: {
                    fields: {
                      left: {
                        type: "string",
                        id: 1
                      },
                      leftExpression: {
                        type: "KeyExpression",
                        id: 2
                      },
                      right: {
                        type: "string",
                        id: 3
                      },
                      rightExpression: {
                        type: "KeyExpression",
                        id: 4
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  google: {
    nested: {
      protobuf: {
        nested: {
          FileDescriptorSet: {
            fields: {
              file: {
                rule: "repeated",
                type: "FileDescriptorProto",
                id: 1
              }
            }
          },
          FileDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              "package": {
                type: "string",
                id: 2
              },
              dependency: {
                rule: "repeated",
                type: "string",
                id: 3
              },
              publicDependency: {
                rule: "repeated",
                type: "int32",
                id: 10,
                options: {
                  packed: false
                }
              },
              weakDependency: {
                rule: "repeated",
                type: "int32",
                id: 11,
                options: {
                  packed: false
                }
              },
              messageType: {
                rule: "repeated",
                type: "DescriptorProto",
                id: 4
              },
              enumType: {
                rule: "repeated",
                type: "EnumDescriptorProto",
                id: 5
              },
              service: {
                rule: "repeated",
                type: "ServiceDescriptorProto",
                id: 6
              },
              extension: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 7
              },
              options: {
                type: "FileOptions",
                id: 8
              },
              sourceCodeInfo: {
                type: "SourceCodeInfo",
                id: 9
              },
              syntax: {
                type: "string",
                id: 12
              }
            }
          },
          DescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              field: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 2
              },
              extension: {
                rule: "repeated",
                type: "FieldDescriptorProto",
                id: 6
              },
              nestedType: {
                rule: "repeated",
                type: "DescriptorProto",
                id: 3
              },
              enumType: {
                rule: "repeated",
                type: "EnumDescriptorProto",
                id: 4
              },
              extensionRange: {
                rule: "repeated",
                type: "ExtensionRange",
                id: 5
              },
              oneofDecl: {
                rule: "repeated",
                type: "OneofDescriptorProto",
                id: 8
              },
              options: {
                type: "MessageOptions",
                id: 7
              },
              reservedRange: {
                rule: "repeated",
                type: "ReservedRange",
                id: 9
              },
              reservedName: {
                rule: "repeated",
                type: "string",
                id: 10
              }
            },
            nested: {
              ExtensionRange: {
                fields: {
                  start: {
                    type: "int32",
                    id: 1
                  },
                  end: {
                    type: "int32",
                    id: 2
                  }
                }
              },
              ReservedRange: {
                fields: {
                  start: {
                    type: "int32",
                    id: 1
                  },
                  end: {
                    type: "int32",
                    id: 2
                  }
                }
              }
            }
          },
          FieldDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              number: {
                type: "int32",
                id: 3
              },
              label: {
                type: "Label",
                id: 4
              },
              type: {
                type: "Type",
                id: 5
              },
              typeName: {
                type: "string",
                id: 6
              },
              extendee: {
                type: "string",
                id: 2
              },
              defaultValue: {
                type: "string",
                id: 7
              },
              oneofIndex: {
                type: "int32",
                id: 9
              },
              jsonName: {
                type: "string",
                id: 10
              },
              options: {
                type: "FieldOptions",
                id: 8
              }
            },
            nested: {
              Type: {
                values: {
                  TYPE_DOUBLE: 1,
                  TYPE_FLOAT: 2,
                  TYPE_INT64: 3,
                  TYPE_UINT64: 4,
                  TYPE_INT32: 5,
                  TYPE_FIXED64: 6,
                  TYPE_FIXED32: 7,
                  TYPE_BOOL: 8,
                  TYPE_STRING: 9,
                  TYPE_GROUP: 10,
                  TYPE_MESSAGE: 11,
                  TYPE_BYTES: 12,
                  TYPE_UINT32: 13,
                  TYPE_ENUM: 14,
                  TYPE_SFIXED32: 15,
                  TYPE_SFIXED64: 16,
                  TYPE_SINT32: 17,
                  TYPE_SINT64: 18
                }
              },
              Label: {
                values: {
                  LABEL_OPTIONAL: 1,
                  LABEL_REQUIRED: 2,
                  LABEL_REPEATED: 3
                }
              }
            }
          },
          OneofDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              options: {
                type: "OneofOptions",
                id: 2
              }
            }
          },
          EnumDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              value: {
                rule: "repeated",
                type: "EnumValueDescriptorProto",
                id: 2
              },
              options: {
                type: "EnumOptions",
                id: 3
              }
            }
          },
          EnumValueDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              number: {
                type: "int32",
                id: 2
              },
              options: {
                type: "EnumValueOptions",
                id: 3
              }
            }
          },
          ServiceDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              method: {
                rule: "repeated",
                type: "MethodDescriptorProto",
                id: 2
              },
              options: {
                type: "ServiceOptions",
                id: 3
              }
            }
          },
          MethodDescriptorProto: {
            fields: {
              name: {
                type: "string",
                id: 1
              },
              inputType: {
                type: "string",
                id: 2
              },
              outputType: {
                type: "string",
                id: 3
              },
              options: {
                type: "MethodOptions",
                id: 4
              },
              clientStreaming: {
                type: "bool",
                id: 5
              },
              serverStreaming: {
                type: "bool",
                id: 6
              }
            }
          },
          FileOptions: {
            fields: {
              javaPackage: {
                type: "string",
                id: 1
              },
              javaOuterClassname: {
                type: "string",
                id: 8
              },
              javaMultipleFiles: {
                type: "bool",
                id: 10
              },
              javaGenerateEqualsAndHash: {
                type: "bool",
                id: 20,
                options: {
                  deprecated: true
                }
              },
              javaStringCheckUtf8: {
                type: "bool",
                id: 27
              },
              optimizeFor: {
                type: "OptimizeMode",
                id: 9,
                options: {
                  "default": "SPEED"
                }
              },
              goPackage: {
                type: "string",
                id: 11
              },
              ccGenericServices: {
                type: "bool",
                id: 16
              },
              javaGenericServices: {
                type: "bool",
                id: 17
              },
              pyGenericServices: {
                type: "bool",
                id: 18
              },
              deprecated: {
                type: "bool",
                id: 23
              },
              ccEnableArenas: {
                type: "bool",
                id: 31
              },
              objcClassPrefix: {
                type: "string",
                id: 36
              },
              csharpNamespace: {
                type: "string",
                id: 37
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                38,
                38
              ]
            ],
            nested: {
              OptimizeMode: {
                values: {
                  SPEED: 1,
                  CODE_SIZE: 2,
                  LITE_RUNTIME: 3
                }
              }
            }
          },
          MessageOptions: {
            fields: {
              messageSetWireFormat: {
                type: "bool",
                id: 1
              },
              noStandardDescriptorAccessor: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              mapEntry: {
                type: "bool",
                id: 7
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                8,
                8
              ]
            ]
          },
          FieldOptions: {
            fields: {
              ctype: {
                type: "CType",
                id: 1,
                options: {
                  "default": "STRING"
                }
              },
              packed: {
                type: "bool",
                id: 2
              },
              jstype: {
                type: "JSType",
                id: 6,
                options: {
                  "default": "JS_NORMAL"
                }
              },
              lazy: {
                type: "bool",
                id: 5
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              weak: {
                type: "bool",
                id: 10
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ],
            reserved: [
              [
                4,
                4
              ]
            ],
            nested: {
              CType: {
                values: {
                  STRING: 0,
                  CORD: 1,
                  STRING_PIECE: 2
                }
              },
              JSType: {
                values: {
                  JS_NORMAL: 0,
                  JS_STRING: 1,
                  JS_NUMBER: 2
                }
              }
            }
          },
          OneofOptions: {
            fields: {
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          EnumOptions: {
            fields: {
              allowAlias: {
                type: "bool",
                id: 2
              },
              deprecated: {
                type: "bool",
                id: 3
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          EnumValueOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 1
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          ServiceOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 33
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          MethodOptions: {
            fields: {
              deprecated: {
                type: "bool",
                id: 33
              },
              uninterpretedOption: {
                rule: "repeated",
                type: "UninterpretedOption",
                id: 999
              }
            },
            extensions: [
              [
                1000,
                536870911
              ]
            ]
          },
          UninterpretedOption: {
            fields: {
              name: {
                rule: "repeated",
                type: "NamePart",
                id: 2
              },
              identifierValue: {
                type: "string",
                id: 3
              },
              positiveIntValue: {
                type: "uint64",
                id: 4
              },
              negativeIntValue: {
                type: "int64",
                id: 5
              },
              doubleValue: {
                type: "double",
                id: 6
              },
              stringValue: {
                type: "bytes",
                id: 7
              },
              aggregateValue: {
                type: "string",
                id: 8
              }
            },
            nested: {
              NamePart: {
                fields: {
                  namePart: {
                    rule: "required",
                    type: "string",
                    id: 1
                  },
                  isExtension: {
                    rule: "required",
                    type: "bool",
                    id: 2
                  }
                }
              }
            }
          },
          SourceCodeInfo: {
            fields: {
              location: {
                rule: "repeated",
                type: "Location",
                id: 1
              }
            },
            nested: {
              Location: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1
                  },
                  span: {
                    rule: "repeated",
                    type: "int32",
                    id: 2
                  },
                  leadingComments: {
                    type: "string",
                    id: 3
                  },
                  trailingComments: {
                    type: "string",
                    id: 4
                  },
                  leadingDetachedComments: {
                    rule: "repeated",
                    type: "string",
                    id: 6
                  }
                }
              }
            }
          },
          GeneratedCodeInfo: {
            fields: {
              annotation: {
                rule: "repeated",
                type: "Annotation",
                id: 1
              }
            },
            nested: {
              Annotation: {
                fields: {
                  path: {
                    rule: "repeated",
                    type: "int32",
                    id: 1
                  },
                  sourceFile: {
                    type: "string",
                    id: 2
                  },
                  begin: {
                    type: "int32",
                    id: 3
                  },
                  end: {
                    type: "int32",
                    id: 4
                  }
                }
              }
            }
          },
          Any: {
            fields: {
              type_url: {
                type: "string",
                id: 1
              },
              value: {
                type: "bytes",
                id: 2
              }
            }
          }
        }
      }
    }
  },
  notification: {
    nested: {
      NotificationMessage: {
        fields: {
          notificationId: {
            type: "string",
            id: 1,
            options: {
              "(webaas.db.record.field).primary_key": true
            }
          },
          appID: {
            type: "string",
            id: 2
          },
          schemaName: {
            type: "string",
            id: 3
          },
          recordKeys: {
            rule: "repeated",
            type: "string",
            id: 4
          }
        }
      }
    }
  }
});

module.exports = $root;
