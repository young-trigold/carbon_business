import { Node as ProseMirrorNode } from 'prosemirror-model';

const cellAttrs = {
	colspan: { default: 1 },
	rowspan: { default: 1 },
	colwidth: { default: null },
	align: { default: 'center' },
};

const getCellAttrs = (dom: HTMLElement, extraAttrs: Record<string, any>) => {
	const widthAttr = dom.getAttribute('data-colwidth');
	const widths =
		widthAttr && /^\d+(,\d+)*$/.test(widthAttr) ? widthAttr.split(',').map((s) => Number(s)) : null;
	const colspan = Number(dom.getAttribute('colspan') || 1);
	const result: Record<string, unknown> = {
		colspan,
		rowspan: Number(dom.getAttribute('rowspan') || 1),
		colwidth: widths && widths.length === colspan ? widths : null,
		align: dom.getAttribute('align') || 'left',
	};
	for (const prop in extraAttrs) {
		const getter = extraAttrs[prop].getFromDOM;
		const value = getter && getter(dom);
		if (value !== null) {
			result[prop] = value;
		}
	}
	return result;
};

const setCellAttrs = (node: ProseMirrorNode, extraAttrs: Record<string, any>) => {
	const attrs: Record<string, any> = {};
	if (node.attrs.colspan !== 1) {
		attrs.colspan = node.attrs.colspan;
	}
	if (node.attrs.rowspan !== 1) {
		attrs.rowspan = node.attrs.rowspan;
	}
	if (node.attrs.colwidth) {
		attrs['data-colwidth'] = node.attrs.colwidth.join(',');
	}
	for (const prop in extraAttrs) {
		const setter = extraAttrs[prop].setDOMAttr;
		if (setter) {
			setter(node.attrs[prop], attrs);
		}
	}
	attrs.align = node.attrs.align;
	return attrs;
};

export {cellAttrs, getCellAttrs , setCellAttrs };
