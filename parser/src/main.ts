import { queryLLM } from "./agent.controller.js";
import { parseKwork } from "./parser.js";

type worker = () => void;

const agentWorker: worker = () => {};
