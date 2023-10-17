import Title from './title';
import styled from '../../pre-start/themes';


const StyledText = styled(Title)`
  color: ${props => props.theme.color.bold};
`;

export default function StepText(props: {number: number}) {
  return (
    <StyledText>{props.number + 1}ª etapa</StyledText>
  )
}