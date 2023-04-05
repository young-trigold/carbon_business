import { memo, useCallback, useEffect, useState } from 'react'

import { styled } from '@mui/material'
import { useAppSelector } from '../../../../../app/store'
import InsertOptionContainer from './InsertOptionContainer'

interface StyledInsertTooltipProps {
	visible: boolean
	position: Pick<DOMRect, 'left' | 'top'>
}

export const InsertTooltipWidth = 14
export const InsertTooltipHeight = 14

const StyledInsertTooltip = styled("div")<StyledInsertTooltipProps>((props) => ({
  position: "absolute",
	width: `${InsertTooltipWidth}px`,
	height: `${InsertTooltipHeight}px`,
	left: 0,
	top: 0,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	opacity: (props.visible ? 1 : 0),
	visibility:(props.visible ? 'unset' : 'hidden'),
	transform:
		`translate(${props.position.left - InsertTooltipWidth / 2}px, ${props.position.top + 2}px)`,
	borderRadius: "50%",
	// border: `1px solidprops.theme.borderColor`,
	// boxShadow: `0 0 2px ${props.theme.shadowColor}`,
	color: props.theme.palette.warning.main,
	// backgroundColor: props.theme.surfaceColor,
	// transition: props.theme.transition,
	userSelect: "none",
	zIndex: 1,
}))

interface InsertTooltipProps {}

const InsertTooltip = (props: InsertTooltipProps) => {
	const { insertTooltip } = useAppSelector((state) => state.articlePage.editor.plugin)
	const { visible, position } = insertTooltip
	const [insertOptionContainerVisible, setInsertOptionContainerVisible] = useState(false)

	useEffect(() => {
		setInsertOptionContainerVisible(false)
	}, [position])

	const handleInsertTooltipClicked: React.MouseEventHandler = useCallback((event) => {
		event.stopPropagation()
		setInsertOptionContainerVisible(true)
	}, [])

	useEffect(() => {
		const handleClick = () => {
			setInsertOptionContainerVisible(false)
		}
		window.addEventListener('click', handleClick)

		return () => {
			window.removeEventListener('click', handleClick)
		}
	}, [])

	return (
		<>
			<StyledInsertTooltip
				visible={visible}
				position={position}
				onClick={handleInsertTooltipClicked}
			>
				<span>✛</span>
			</StyledInsertTooltip>
			{insertOptionContainerVisible && <InsertOptionContainer />}
		</>
	)
}

export default memo(InsertTooltip)
