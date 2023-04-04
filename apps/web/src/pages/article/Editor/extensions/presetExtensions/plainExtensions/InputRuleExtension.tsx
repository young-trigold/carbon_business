import { InputRule, inputRules as createInputRulePlugin } from 'prosemirror-inputrules';
import { extensionName } from '../../decorators/extensionName';
import { MarkExtension, NodeExtension, PlainExtension } from '../../type';

@extensionName('input_rule')
class InputRuleExtension extends PlainExtension {
	createPlugins() {
		if (!this.editorStore) return [];
		const createInputRule = (extension: MarkExtension | NodeExtension) =>
			extension.createInputRules?.();
		const markInputRules = this.editorStore.markExtensions.map(createInputRule);
		const nodeInputRules = this.editorStore.nodeExtensions.map(createInputRule);
		const inputRules = [...markInputRules, ...nodeInputRules].flat().filter(Boolean) as InputRule[];
		const inputRulePlugin = createInputRulePlugin({ rules: inputRules });
		return [inputRulePlugin];
	}
}

export default InputRuleExtension;
