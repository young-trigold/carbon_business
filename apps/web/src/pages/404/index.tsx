
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const StyledNotFoundPage = styled('div')(({theme}) => ({
  height: '100vh',
	display: 'flex',
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
}));

const NotFoundPage = () => {
	return (
		<StyledNotFoundPage>
			<h1>找不到该页面</h1>
			<Link to="/" replace>
				回到主页
			</Link>
		</StyledNotFoundPage>
	);
};

export default (NotFoundPage);
