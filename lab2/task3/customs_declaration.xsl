<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <head>
                <title>Митна декларація</title>
                <link rel="stylesheet" href="customs_declaration_html.css" type="text/css"/>
            </head>
            <body>
                <h1>Митна декларація</h1>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ПІБ</th>
                            <th>Країна проживання</th>
                            <th>Країна призначення</th>
                            <th>Сума грошей</th>
                            <th>Спеціальний багаж</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="customs_declaration/person">
                            <tr>
                                <td>
                                    <xsl:value-of select="last_name"/> 
                                    <xsl:value-of select="first_name"/> 
                                    <xsl:value-of select="middle_name"/>
                                </td>
                                <td><xsl:value-of select="residence_country"/></td>
                                <td><xsl:value-of select="destination_country"/></td>
                                <td>
                                    <xsl:value-of select="money_amount"/> (<xsl:value-of select="money_amount/@currency"/>)
                                </td>
                                <td><xsl:value-of select="special_luggage"/></td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>