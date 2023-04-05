import axios from 'axios';
import { memo, useRef } from 'react';

import PictureIconSrc from '@/static/icon/picture.png';
import { StyledOption } from '.';
import { useAppDispatch, useAppSelector } from '../../../../../../app/store';

const InsertPictureOption = () => {
	const inputFileRef = useRef<HTMLInputElement>(null);

	const handleOptionClick = () => {
		if (!inputFileRef.current) return;
		inputFileRef.current.click();
	};

	const { editorStore } = useAppSelector((state) => state.articlePage.editor);
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
				
			} catch (error) {
				
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
