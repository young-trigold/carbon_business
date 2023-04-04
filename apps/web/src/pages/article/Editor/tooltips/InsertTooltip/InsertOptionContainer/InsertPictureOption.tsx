import axios from 'axios';
import { memo, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { message } from '@/components/Message';
import PictureIconSrc from '@/static/icon/picture.png';
import { StyledOption } from '.';

const InsertPictureOption = () => {
	const inputFileRef = useRef<HTMLInputElement>(null);

	const handleOptionClick = () => {
		if (!inputFileRef.current) return;
		inputFileRef.current.click();
	};

	const { editorStore } = useAppSelector((state) => state.contentPage.editor);
	const dispatch = useAppDispatch();
	const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		const { files } = event.target;
		if (!files || files.length === 0) return;
		if (!editorStore) return;
		const { view: editorView } = editorStore;
		if (!editorView) return;
		const { state: editorState } = editorView;
		const uploadImages = async () => {
			try {
				const formData = new FormData();
				formData.append('file', files[0]);
				const res = await axios.post<{ fileURL: string }>('/api/singleUpload', formData);
				const { fileURL } = res.data;
				const attrs = { src: fileURL };
				const node = editorState.schema.nodes.image.create(attrs);
				const transaction = editorState.tr.replaceSelectionWith(node, false);
				editorView.dispatch(transaction);
				message.success('图片插入成功!');
			} catch (error) {
				if (axios.isAxiosError(error))
					return message.error((error.response?.data as { message: string })?.message);
				if (error instanceof Error) return message.error(error.message);
				return message.error(JSON.stringify(error));
			}
		};

		uploadImages();
	};

	return (
		<StyledOption onClick={handleOptionClick}>
			<img src={PictureIconSrc} alt="图片" width={24} />
			<span>插入图片</span>
			<input
				ref={inputFileRef}
				onChange={onChange}
				type="file"
				accept="image/*"
				style={{ display: 'none' }}
			/>
		</StyledOption>
	);
};

export default memo(InsertPictureOption);
