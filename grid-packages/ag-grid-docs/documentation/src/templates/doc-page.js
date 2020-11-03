import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import rehypeReact from 'rehype-react';
import ExampleRunner from '../components/example-runner';
import SideMenu from '../components/SideMenu';
import processFrameworkSpecificSections from '../utils/framework-specific-sections';
import { getPageName } from '../utils/get-page-name';
import styles from './doc-page.module.scss';
import { ApiDocumentation } from '../components/ApiDocumentation';

const DocPageTemplate = ({ data, pageContext: { framework }, location }) => {
  const { markdownRemark: page } = data;
  const pageName = getPageName(location.pathname);
  const ast = processFrameworkSpecificSections(page.htmlAst, framework);

  const renderAst = new rehypeReact({
    createElement: React.createElement,
    components: {
      'grid-example': props => ExampleRunner({ ...props, framework, pageName, library: 'grid' }),
      'chart-example': props => ExampleRunner({ ...props, framework, pageName, library: 'chart' }),
      'api-documentation': props => ApiDocumentation({ ...props, pageName, config: props.config ? JSON.parse(props.config) : {} })
    },
  }).Compiler;

  return (
    <div className={styles.docPageWrapper}>
      <div className={styles.docPage}>
        <Helmet title={`AG-Grid: ${page.frontmatter.title}`} />
        <h1>{page.frontmatter.title}</h1>
        {renderAst(ast)}
      </div>
      {page.headings && <SideMenu headings={page.headings} />}
    </div>
  );
};

export const pageQuery = graphql`
  query DocPageByPath($srcPath: String!) {
    markdownRemark(fields: { path: { eq: $srcPath } }) {
      htmlAst
      frontmatter {
        title
      }
      headings {
        id
        depth
        value
      }
    }
  }
`;

export default DocPageTemplate;
