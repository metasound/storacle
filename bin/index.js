#!/usr/bin/env node
import * as runner from "./runner.js";
import Node from "../src/index.js";
import actions from "./actions.js";
runner('storacle', Node, actions);
