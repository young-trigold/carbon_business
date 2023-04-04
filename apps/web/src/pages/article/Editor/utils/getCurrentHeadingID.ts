import { HeaderHeight } from '../../../../../components/Header';
import { HeadingMaxLevel } from '../extensions';

const getCurrentHeadingId = (container: HTMLElement) => {
	const allHeadingElements = Array.from<HTMLHeadingElement>({ length: HeadingMaxLevel }).reduce(
		(result, _, i) => {
			const headingElements = Array.from(
				container.querySelectorAll<HTMLHeadingElement>(`h${i + 1}`),
			);
			return result.concat(headingElements);
		},
		[] as HTMLHeadingElement[],
	);

	if (allHeadingElements.length === 0) return;

	const headingElementToTopMap = new Map(
		allHeadingElements.map((headingElement) => [
			headingElement,
			headingElement.getBoundingClientRect().top,
		]),
	);

	const currentHeadingElement = [...headingElementToTopMap].sort(
		(a, b) => Math.abs(a[1] - HeaderHeight) - Math.abs(b[1] - HeaderHeight),
	)[0][0];
	const currentHeadingId = currentHeadingElement.getAttribute('data-heading-id')!;

	return currentHeadingId;
};

export default getCurrentHeadingId;
