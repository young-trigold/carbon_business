import DocExtension from './presetExtensions/nodeExtensions/DocExtension';
import ParagraphExtension from './presetExtensions/nodeExtensions/ParagraphExtension';
import TextExtension from './presetExtensions/nodeExtensions/TextExtension';
import CommandExtension from './presetExtensions/plainExtensions/CommandExtension';
import DecorationExtension from './presetExtensions/plainExtensions/DecorationExtension';
import HistoryExtension from './presetExtensions/plainExtensions/HistoryExtension';
import InputRuleExtension from './presetExtensions/plainExtensions/InputRuleExtension';
import KeyMapExtension from './presetExtensions/plainExtensions/KeyMapExtension';
import NodeViewExtension from './presetExtensions/plainExtensions/NodeViewExtension';
import PasteRuleExtension from './presetExtensions/plainExtensions/PasteRuleExtension';
import PluginExtension from './presetExtensions/plainExtensions/PluginExtension';
import SchemaExtension from './presetExtensions/plainExtensions/SchemaExtension';
import { TrailingNodeExtension } from './presetExtensions/plainExtensions/trailingNodeExtension';

export const presetNodeExtensions = [DocExtension, TextExtension, ParagraphExtension];

// 以下顺序不可变动
// SchemaExtension > PluginExtension > CommandExtension
export const presetPlainExtensions = [
  SchemaExtension,
  PluginExtension,
  CommandExtension,
  InputRuleExtension,
  PasteRuleExtension,
  KeyMapExtension,
  NodeViewExtension,
  DecorationExtension,
  HistoryExtension,
  TrailingNodeExtension,
];

export { BoldExtension } from './markExtensions/BoldExtension';
export { CodeExtension } from './markExtensions/CodeExtension';
export { ItalicExtension } from './markExtensions/ItalicExtension';
export { LinkExtension } from './markExtensions/LinkExtension';
export { SubExtension } from './markExtensions/SubExtension';
export { SupExtension } from './markExtensions/SupExtension';
export { UnderlineExtension } from './markExtensions/UnderlineExtension';
export { CodeBlockExtension } from './nodeExtensions/codeBlockExtension';
export { HeadingExtension, HeadingMaxLevel } from './nodeExtensions/HeadingExtension';
