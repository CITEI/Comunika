import * as React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import Markdown, {MarkdownIt} from 'react-native-markdown-display'
import Title from '../atom/title'
import styled from '../../pre-start/themes'
import { sp } from '../../helper/resolution';

interface MdProps {
  children: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  boldStyle?: TextStyle;
  titleStyle?: TextStyle;
}

const Body = styled.View`
  font-family: ${(props) => props.theme.fontFamily.text};
  color: ${(props) => props.theme.color.text};
  font-size: ${(props) => sp(12)}px;
  text-align: center;
`

const Bold = styled.Text`
  font-weight: bold;
  color: ${(props) => props.theme.color.bold};
`

/** Parses text as markdown
 *
 * Current available features:
 * - Parses ordered lists as bold
 * - Parses h1 as title
 * - Parses italic and bold
 */
const Md: React.VoidFunctionComponent<MdProps> = (props) => {
  /** Parses ordered lists as bold */
  const text = React.useMemo(() => {
    const regex = '(\\d+\\s?[|.])\\s';
    return props.children
      .replace(RegExp(`^${regex}`, 'g'), '**$1** ')
      .replace(RegExp(`\n${regex}`, 'g'), '\n\n**$1** ');
  }, [props.children])

  /** Configures markdown parser */
  const markdownit = React.useMemo(() => MarkdownIt({typographer: true}).disable([ 'list' ]), [])

  return (
    <View style={props.style}>
      <Markdown
        style={{
          body: props.textStyle || {},
          bold: props.boldStyle || {},
          heading1: props.titleStyle || {fontSize: sp(18)},
        }}
        rules={{
          body: (node, children, parent, styles) => (
            <Body key={node.key} style={styles.body}>{children}</Body>
          ),
          strong: (node, children, parent, styles) => (
            <Bold key={node.key} style={styles.bold}>{children}</Bold>
          ),
          heading1: (node, children, parent, styles) => (
            <Title key={node.key} style={styles.heading1}>{children}</Title>
          ),
        }}
        mergeStyle={true}
        debugPrintTree={false}
        markdownit={markdownit}
      >
        {text}
      </Markdown>
    </View>
  )
}

export default Md