import { extensionName } from '../../decorators/extensionName';
import { MarkExtension, NodeExtension, PlainExtension } from '../../type';

@extensionName('command')
class CommandExtension extends PlainExtension {
	onEditorViewCreate(): void {
		const createCommands = (result: any, extension: MarkExtension | NodeExtension) => {
			if (extension.createCommands) {
				const commands = Object.entries(extension.createCommands()).reduce(
					(result, [commandName, returnCommand]) => {
						result[commandName] = (...args: any[]) => {
							const { view } = this.editorStore!;
							returnCommand(...args)(view!.state, view?.dispatch, view!);
						};
						return result;
					},
					{} as Record<string, (...args: any[]) => void>,
				);
				result[extension.name] = commands;
			}
			return result;
		};
		const markCommands = this.editorStore!.markExtensions.reduce(createCommands, {});
		const nodeCommands = this.editorStore!.nodeExtensions.reduce(createCommands, {});
		const allCommands = {
			...markCommands,
			...nodeCommands,
		};
		this.editorStore!.commands = allCommands;
	}
}

export default CommandExtension;
