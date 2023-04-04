import { InputRule } from 'prosemirror-inputrules';
import { MarkType, NodeType } from 'prosemirror-model';

// type NodeInputRuleProps = {
// 	regexp: RegExp;
// 	type: NodeType;
// 	getAttributes,
// 	beforeDispatch,
// 	shouldSkip,
// 	ignoreWhitespace = false,
// 	updateCaptured,
// 	invalidMarks,
// };

// export function nodeInputRule(props: NodeInputRuleProps) {
// 	const {
// 		regexp,
// 		type,
// 		getAttributes,
// 		beforeDispatch,
// 		shouldSkip,
// 		ignoreWhitespace = false,
// 		updateCaptured,
// 		invalidMarks,
// 	} = props;

// 	const rule = new InputRule(regexp, (state, match, start, end) => {
// 		const attributes = isFunction(getAttributes) ? getAttributes(match) : getAttributes;
// 		const { tr, schema } = state;
// 		let captureGroup: string | undefined = match[1];
// 		let fullMatch = match[0];

// 		// These are the attributes which are added to the mark and they can be
// 		// obtained from the match if a function is provided.
// 		const details = gatherDetails({
// 			captureGroup,
// 			fullMatch,
// 			end,
// 			start,
// 			rule,
// 			state,
// 			ignoreWhitespace,
// 			invalidMarks,
// 			shouldSkip,
// 			updateCaptured,
// 		});

// 		if (!details) {
// 			return null;
// 		}

// 		({ start, end, captureGroup, fullMatch } = details);

// 		const content = type.createAndFill(attributes);

// 		if (content) {
// 			tr.replaceRangeWith(type.isBlock ? tr.doc.resolve(start).before() : start, end, content);
// 			beforeDispatch?.({ tr, match: [fullMatch, captureGroup ?? ''], start, end });
// 		}

// 		return tr;
// 	});

// 	return rule;
// }

export const markInputRule = (
	regexp: RegExp,
	markType: MarkType,
	getAttrs?: { [key: string]: any } | ((p: string[]) => { [key: string]: any } | null | undefined),
) => {
	return new InputRule(regexp, (state, match, start, end) => {
		const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
		const { tr } = state;
		if (match[1]) {
			const textStart = start + match[0].indexOf(match[1]);
			const textEnd = textStart + match[1].length;
			if (textEnd < end) {
				tr.delete(textEnd, end);
			}
			if (textStart > start) {
				tr.delete(start, textStart);
			}
			end = start + match[1].length;
		}
		return tr.addMark(start, end, markType.create(attrs || {}));
	});
};
