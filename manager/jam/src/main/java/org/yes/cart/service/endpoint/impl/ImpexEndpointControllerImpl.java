/*
 * Copyright 2009 Inspire-Software.com
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package org.yes.cart.service.endpoint.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yes.cart.bulkcommon.service.ExportDirectorService;
import org.yes.cart.bulkcommon.service.ImportDirectorService;
import org.yes.cart.domain.misc.Pair;
import org.yes.cart.domain.vo.*;
import org.yes.cart.service.async.model.JobStatus;
import org.yes.cart.service.endpoint.ImpexEndpointController;
import org.yes.cart.service.vo.VoDataGroupService;
import org.yes.cart.service.vo.VoDataGroupServiceSupport;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * User: denispavlov
 * Date: 13/09/2016
 * Time: 12:33
 */
@Controller
public class ImpexEndpointControllerImpl implements ImpexEndpointController {

    private final ImportDirectorService importDirectorService;
    private final ExportDirectorService exportDirectorService;
    private final VoDataGroupService voDataGroupService;
    private final VoDataGroupServiceSupport voDataGroupServiceSupport;

    @Autowired
    public ImpexEndpointControllerImpl(final ImportDirectorService importDirectorService,
                                       final ExportDirectorService exportDirectorService,
                                       final VoDataGroupService voDataGroupService,
                                       final VoDataGroupServiceSupport voDataGroupServiceSupport) {
        this.importDirectorService = importDirectorService;
        this.exportDirectorService = exportDirectorService;
        this.voDataGroupService = voDataGroupService;
        this.voDataGroupServiceSupport = voDataGroupServiceSupport;
    }

    @Override
    public @ResponseBody
    List<VoDataGroupImpEx> getExportGroups(@RequestParam("lang") final String language) throws Exception {
        return mapToGroups(this.exportDirectorService.getExportGroups(language));
    }

    @Override
    public @ResponseBody
    VoJobStatus doExport(final VoImpExJob impExJob) {
        return statusToVo(this.exportDirectorService.doExport(impExJob.getGroup(), impExJob.getFileName(), true));
    }

    @Override
    public @ResponseBody
    VoJobStatus getExportStatus(@RequestParam("token")  final String token) {
        return statusToVo(this.exportDirectorService.getExportStatus(token));
    }

    @Override
    public @ResponseBody
    List<VoDataGroupImpEx> getImportGroups(@RequestParam("lang") final String language) throws Exception {
        return mapToGroups(this.importDirectorService.getImportGroups(language));
    }

    @Override
    public @ResponseBody
    VoJobStatus doImport(@RequestBody final VoImpExJob impExJob) {
        return statusToVo(this.importDirectorService.doImport(impExJob.getGroup(), impExJob.getFileName(), true));
    }

    @Override
    public @ResponseBody
    VoJobStatus getImportStatus(@RequestParam("token") final String token) {
        return statusToVo(this.importDirectorService.getImportStatus(token));
    }


    private List<VoDataGroupImpEx> mapToGroups(final List<Map<String, String>> groups) throws Exception {

        final List<String> names = groups.stream().map(group -> group.get("name")).collect(Collectors.toList());
        return voDataGroupServiceSupport.getDataGroupsByNames(names);

    }

    private VoJobStatus statusToVo(final JobStatus status) {
        final VoJobStatus vo = new VoJobStatus();
        vo.setToken(status.getToken());
        vo.setState(status.getState().name());
        vo.setReport(status.getReport());
        if (status.getCompletion() != null) {
            vo.setCompletion(status.getCompletion().name());
        }
        return vo;
    }

    @Override
    public @ResponseBody List<VoDataGroup> getAllDataGroups() throws Exception {
        return voDataGroupService.getAllDataGroups();
    }

    @Override
    public @ResponseBody VoDataGroup getDataGroupById(@PathVariable("id") final long id) throws Exception {
        return voDataGroupService.getDataGroupById(id);
    }

    @Override
    public @ResponseBody VoDataGroup createDataGroup(@RequestBody final VoDataGroup vo) throws Exception {
        return voDataGroupService.createDataGroup(vo);
    }

    @Override
    public @ResponseBody VoDataGroup updateDataGroup(@RequestBody final VoDataGroup vo) throws Exception {
        return voDataGroupService.updateDataGroup(vo);
    }

    @Override
    public @ResponseBody void removeDataGroup(@PathVariable("id") final long id) throws Exception {
        voDataGroupService.removeDataGroup(id);
    }

    @Override
    public @ResponseBody List<VoDataDescriptor> getAllDataDescriptors() throws Exception {
        return voDataGroupService.getAllDataDescriptors();
    }

    @Override
    public @ResponseBody VoDataDescriptor getDataDescriptorById(@PathVariable("id") final long id) throws Exception {
        return voDataGroupService.getDataDescriptorById(id);
    }

    @Override
    public @ResponseBody VoDataDescriptor createDataDescriptor(@RequestBody final VoDataDescriptor vo) throws Exception {
        return voDataGroupService.createDataDescriptor(vo);
    }

    @Override
    public @ResponseBody VoDataDescriptor updateDataDescriptor(@RequestBody final VoDataDescriptor vo) throws Exception {
        return voDataGroupService.updateDataDescriptor(vo);
    }

    @Override
    public @ResponseBody void removeDataDescriptor(@PathVariable("id") final long id) throws Exception {
        voDataGroupService.removeDataDescriptor(id);
    }

    @Override
    public void downloadDataGroupDescriptorTemplates(final long id, final HttpServletResponse response) throws Exception {

        final Pair<String, byte[]> template = this.voDataGroupServiceSupport.generateDataGroupDescriptorTemplates(id);
        final byte[] content = template != null ? template.getSecond() : new byte[0];

        response.setContentType("application/zip, application/octet-stream");

        response.setContentLength(content.length);

        response.getOutputStream().write(content);

        response.flushBuffer();

    }
}
