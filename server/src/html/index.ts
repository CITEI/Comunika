export function content({ code }: { code: string }) {
  const color = "#FF2869";

  const logo = `data:image/png;base64,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`;

  return `

  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   <html xmlns="http://www.w3.org/1999/xhtml"
   xmlns:o="urn:schemas-microsoft-com:office:office"
   style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    <head>
     <meta charset="UTF-8">
     <meta content="width=device-width, initial-scale=1" name="viewport">
     <meta name="x-apple-disable-message-reformatting">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta content="telephone=no" name="format-detection">
     <title>Novo modelo de e-mail 2022-12-19</title>
     <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
 
     <style type="text/css">
   #outlook a {
     padding:0;
   }
   .ExternalClass {
     width:100%;
   }
   .ExternalClass,
   .ExternalClass p,
   .ExternalClass span,
   .ExternalClass font,
   .ExternalClass td,
   .ExternalClass div {
     line-height:100%;
   }
   .es-button {
     mso-style-priority:100!important;
     text-decoration:none!important;
   }
   a[x-apple-data-detectors] {
     color:inherit!important;
     text-decoration:none!important;
     font-size:inherit!important;
     font-family:inherit!important;
     font-weight:inherit!important;
     line-height:inherit!important;
   }
   .es-desk-hidden {
     display:none;
     float:left;
     overflow:hidden;
     width:0;
     max-height:0;
     line-height:0;
     mso-hide:all;
   }
   .es-button-border:hover a.es-button, .es-button-border:hover button.es-button {
     background:#3498db!important;
     border-color:#3498db!important;
   }
   .es-button-border:hover {
     border-color:#1f68b1 #1f68b1 #1f68b1 #1f68b1!important;
     background:#3498db!important;
   }
   [data-ogsb] .es-button {
     border-width:0!important;
     padding:10px 40px 10px 40px!important;
   }
   td .es-button-border:hover a.es-button-1 {
     background:${color}!important;
     border-color:${color}!important;
   }
   td .es-button-border-2:hover {
     background:${color}!important;
   }
   @media only screen and (max-width:600px)
   {p, ul li, ol li, a { line-height:150%!important }
   h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important }
   h1 { font-size:26px!important; text-align:center }
   h2 { font-size:24px!important; text-align:center }
   h3 { font-size:20px!important; text-align:center }
   .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:26px!important }
   .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important }
   .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important }
   .es-menu td a { font-size:13px!important } .es-header-body p, .es-header-body ul li,
   .es-header-body ol li, .es-header-body a { font-size:13px!important } .es-content-body p,
   .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important }
   .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li,
   .es-footer-body a { font-size:13px!important }
   .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li,
   .es-infoblock a { font-size:11px!important } *[class="gmail-fix"] { display:none!important }
   .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important }
   .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important }
   .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important }
   .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important }
   .es-button-border { display:block!important } a.es-button, button.es-button
   { font-size:14px!important; display:block!important; border-left-width:0px!important;
     border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important;
       text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr,
       .es-left, .es-right { width:100%!important } .es-content table, .es-header table,
       .es-footer table, .es-content, .es-footer, .es-header { width:100%!important;
       max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important}
       .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important}
       .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important }
       .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important }
       .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden,
       .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden,
       table.es-desk-hidden { width:auto!important; overflow:visible!important;
       float:none!important; max-height:inherit!important; line-height:inherit!important }
        tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden
        { display:table!important } td.es-desk-menu-hidden { display:table-cell!important }
        .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table
        { width:auto!important } table.es-social { display:inline-block!important }
        table.es-social td { display:inline-block!important } .es-desk-hidden
        { display:table-row!important; width:auto!important; overflow:visible!important;
          max-height:inherit!important } .h-auto { height:auto!important } }
   </style>
    </head>
    <body style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;
    font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;padding:0;Margin:0">
     <div class="es-wrapper-color" style="background-color:#FFFFFF"><!--[if gte mso 9]>
         <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
           <v:fill type="tile" color="#fff"></v:fill>
         </v:background>
       <![endif]-->
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;
      border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;
      background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
        <tr style="border-collapse:collapse">
         <td valign="top" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0"
          class="es-content" align="center" style="mso-table-lspace:0pt;
          mso-table-rspace:0pt;border-collapse:collapse;
          border-spacing:0px;table-layout:fixed !important;width:100%">
            <tr style="border-collapse:collapse">
             <td class="es-info-area" align="center" style="padding:0;Margin:0">
              <table bgcolor="#FFFFFF" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:
 collapse;border-spacing:0px;background-color:transparent;width:600px" data-darkreader-inline-bgcolor>
                <tr style="border-collapse:collapse">
                 <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-
 spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td align="center" class="es-infoblock" style="padding:20px;Margin:0;line-height:120%;font-size:0;color:#CCCCCC">
                          <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;bor
 der-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                             <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:unset;height:1px;width:100%;margin:0px"></td>
                            </tr>
                          </table></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
                <tr style="border-collapse:collapse">
                 <td align="left" style="Margin:0;padding-top:10px;
                 padding-bottom:10px;padding-left:20px;padding-right:20px">
                  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;
                  mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:
                      collapse;border-spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td class="made_with es-infoblock" align="center"
                         style="padding:0;Margin:0;line-height:120%;font-size:0;color:#CCCCCC">
                         <img
                         alt="Embedded Image" src="${logo}" alt width="125" style="display:block;border:0;
                         outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px
 ;table-layout:fixed !important;width:100%">
            <tr style="border-collapse:collapse">
             <td align="center" style="padding:0;Margin:0">
              <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:60
 0px" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center" data-darkreader-inline-bgcolor>
                <tr style="border-collapse:collapse">
                 <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;background-position:center top;background-color:#ffffff" bgcolor="#ffffff" align="left" dat
 a-darkreader-inline-bgcolor>
                  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                      <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center bottom;background-color:tr
 ansparent" width="100%" cellspacing="0" cellpadding="0" bgcolor="transparent" data-darkreader-inline-bgcolor role="presentation">
                        <tr style="border-collapse:collapse">
                         <td bgcolor="transparent" align="left" data-darkreader-inline-bgcolor style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:bold;data-darkreader-inline-color;color:${color}">Olá,&nbsp;</h3></td>
                        </tr>
                        <tr style="border-collapse:collapse">
                         <td bgcolor="transparent" align="left" data-darkreader-inline-bgcolor style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;font-size:14px">Se você não solicitou esse código, por favor ignorar essa solicitação.</p></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
                <tr style="border-collapse:collapse">
                 <td style="padding:0;Margin:0;background-position:center bottom" align="left">
                  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td valign="top" align="center" style="padding:0;Margin:0;width:600px">
                      <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-position:center bottom;background-color:#f
 fffff;border-radius:0px 0px 5px 5px" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" data-darkreader-inline-bgcolor role="presentation">
                        <tr style="border-collapse:collapse">
                         <td height="15" align="center" style="padding:0;Margin:0"></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
                <tr style="border-collapse:collapse">
                 <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;background-position:center bottom" align="left">
                  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                      <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-
 spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td height="10" align="center" style="padding:0;Margin:0"></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
                <tr style="border-collapse:collapse">
                 <td style="padding:0;Margin:0;background-position:center bottom" align="left">
                  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td valign="top" align="center" style="padding:0;Margin:0;width:600px">
                      <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-position:center bottom;background-color:#f
 fffff;border-radius:5px 5px 0px 0px" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" data-darkreader-inline-bgcolor role="presentation">
                        <tr style="border-collapse:collapse">
                         <td height="16" align="center" style="padding:0;Margin:0"></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
                <tr style="border-collapse:collapse">
                 <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;background-position:center bottom;background-color:#ffffff" bgcolor="#ffffff" align="left"
 data-darkreader-inline-bgcolor>
                  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                      <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-
 spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td bgcolor="transparent" align="left" data-darkreader-inline-bgcolor style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px"><p style="Margin:0
 ;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;colo
 r:#666666;font-size:16px">Código de redefinição de senha:</p></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
                <tr style="border-collapse:collapse">
                 <td style="padding:0;Margin:0;background-position:center bottom" align="left">
                  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td valign="top" align="center" style="padding:0;Margin:0;width:600px">
                      <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#ffffff;border-radius:0px 0px 5px 5p
 x" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" data-darkreader-inline-bgcolor role="presentation">
                        <tr style="border-collapse:collapse">
                         <td align="center" style="padding:20px;Margin:0;font-size:0">
                          <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;bor
 der-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                             <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:unset;height:1px;width:100%;margin:0px"></td>
                            </tr>
                          </table></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px
 ;table-layout:fixed !important;width:100%">
            <tr style="border-collapse:collapse">
             <td align="center" style="padding:0;Margin:0">
              <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" data-darkreader-inline-bgcolor style="mso-table-lspace:0pt;mso-ta
 ble-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                <tr style="border-collapse:collapse">
                 <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-
 spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td align="center" class="h-auto" height="45" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;ms
 o-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:36px;color:#000000;font-size:24px" data-darkreader-inline-color>${code}</p></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px
 ;table-layout:fixed !important;width:100%">
            <tr style="border-collapse:collapse">
             <td align="center" style="padding:0;Margin:0">
              <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" data-darkreader-inline-bgcolor style="mso-table-lspace:0pt;mso-ta
 ble-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                <tr style="border-collapse:collapse">
                 <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-
 spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td align="center" style="padding:20px;Margin:0;font-size:0">
                          <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;bor
 der-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                             <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:unset;height:1px;width:100%;margin:0px"></td>
                            </tr>
                          </table></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px
 ;table-layout:fixed !important;width:100%">
            <tr style="border-collapse:collapse">
             <td align="center" style="padding:0;Margin:0">
              <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" data-darkreader-inline-bgcolor style="mso-table-lspace:0pt;mso-ta
 ble-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                <tr style="border-collapse:collapse">
                 <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                  <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td bgcolor="transparent" align="center" data-darkreader-inline-bgcolor style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;font-size:14px" data-darkreader-inline-color"><b style="color:${color}">Código válido por 10 minutos.</b></p></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table></td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" class="es-content" align="center"
      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;
      border-spacing:0px;table-layout:fixed !important;width:100%">
        <tr style="border-collapse:collapse">
         <td align="center" style="padding:0;Margin:0">
          <table bgcolor="#ffffff" class="es-content-body" align="center"
          cellpadding="0" cellspacing="0" data-darkreader-inline-bgcolor
          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;
          border-spacing:0px;background-color:#FFFFFF;width:600px">
            <tr style="border-collapse:collapse">
             <td align="left" style="padding:0;Margin:0;padding-top:20px;
             padding-left:20px;padding-right:20px">
              <table cellpadding="0" cellspacing="0" width="100%"
              style="mso-table-lspace:0pt;mso-table-rspace:0pt;
              border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                 <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                  <table cellpadding="0" cellspacing="0" width="100%"
                  role="presentation" style="mso-table-lspace:0pt;
                  mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr style="border-collapse:collapse">
                     <td align="center" style="padding:20px;Margin:0;font-size:0">
                      <table border="0" width="100%" height="100%" cellpadding="0"
                      cellspacing="0" role="presentation" style="mso-table-lspace:0pt;
                      mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr style="border-collapse:collapse">
                         <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:unset;height:1px;width:100%;margin:0px"></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table></td>
        </tr>
      </table>
     </div>
    </body>
   </html>
`;
}
